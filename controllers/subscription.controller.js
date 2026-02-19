import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js'
import { SERVER_URL } from '../config/env.js';
import User from '../models/user.model.js';

export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();

        res.status(200).json({success: true, data: subscriptions});
    } catch (e) {
        next(e);
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('No subscription found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, data: subscription}); 
    } catch (e) {
        next(e);
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const {workflowRunId} = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        res.status(201).json({success: true, data: {subscription, workflowRunId}});
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});

    } catch (e) {
        next(e);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success:false,
                message: "You are not authorized to cancel this subscription"
            });
        }
        const result = await Subscription.deleteOne({
            user: req.params.id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }
        res.status(200).json({
            success: true, 
            message: "Subscription cancelled successfully"
        });
    } catch (e) {
        next(e);
    }
}

