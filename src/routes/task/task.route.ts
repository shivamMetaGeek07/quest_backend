import express from "express";
import { taskController } from "../../controllers/task/task.controller";
import createReferral from "../../controllers/task/referral";


const taskRouter = express.Router();


// create the task
taskRouter.post( '/visit', taskController.visitLink )

// create a poll
taskRouter.post( '/poll', taskController.createPoll )

// create a invite
taskRouter.post( '/invite', taskController.createInvite )

taskRouter.get( '/get-referral', createReferral);

export default taskRouter;