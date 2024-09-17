import { Router } from "express";
import {body,param} from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import {projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NodeController";

const router=Router()

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
 )

router.get('/', authenticate,ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)
/**Route for task */
router.param('projectId',projectExists)

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)
router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)



router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('TaskId', taskExists)
router.param('TaskId',taskBelongToProject )

router.get('/:projectId/tasks/:TaskId',
    param('TaskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)


router.put('/:projectId/tasks/:TaskId',
    hasAuthorization,
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/tasks/:TaskId',
    hasAuthorization,
    param('TaskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)
router.post('/:projectId/tasks/:TaskId/status',
    param('TaskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatusTask

)
//Routes for teams

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valido'),
        handleInputErrors,
        TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team',
    TeamMemberController.getProjectTeam

)

router.post('/:projectId/team',
body('id')
    .isMongoId().withMessage('ID No valido'),
    handleInputErrors,
    TeamMemberController.addUserById
)
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No valido'),
        handleInputErrors,
        TeamMemberController.removeUserById
    )

 //routes for notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
        handleInputErrors,
        NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes',
      NoteController.getTaskNote
)
router.delete('/:projectId/tasks/:taskId/notes',
    param('nodeId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)
 


export default router