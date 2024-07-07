import express from "express";
import { taskController } from "../../controllers/task/task.controller";
import { createTaskOptions, getTaskOptions, updateTaskOptions } from "../../controllers/task/taskOption.controller";


const taskRouter = express.Router();

// get the tasksoptins and categories
taskRouter.get("/task-options", getTaskOptions);

// create the taskoptions and categories
taskRouter.post( "/task-options", createTaskOptions );

// update the tasksoptions and categories
taskRouter.post( "/update-task-options", updateTaskOptions );

// get all tasks
taskRouter.get( "/", taskController.getAllTask );

// get task by id
taskRouter.get( "/:id", taskController.getTaskByCreatorId );

// create task
taskRouter.post( "/", taskController.addTask );

// // create the task
// taskRouter.post( '/visit', taskController.visitLink )

// // create a poll
// taskRouter.post( '/poll', taskController.createPoll )

// // create a invite
// taskRouter.post( '/invite', taskController.createInvite )


export default taskRouter;