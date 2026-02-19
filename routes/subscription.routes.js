import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { cancelSubscription, createSubscription, getSubscriptionDetails, getSubscriptions, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionDetails);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({title: 'UPDATE subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'DELETE subscription'}));
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.put('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming renewals'}));

export default subscriptionRouter;