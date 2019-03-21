/**
 * @file router file
 */
import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login';
import index from '@/views/index';

import daqian from '@/views/daqian/daqian';
import projectManager from '@/views/daqian/projectManage/projectManager';
import productionMonitor from '@/views/daqian/projectManage/productionMonitor';
import projectList from '@/views/daqian/projectManage/projectList';
import projectProgress from '@/views/daqian/projectManage/projectProgress';
import materialManager from '@/views/daqian/materialManage/materialManager';
import carPlanList from '@/views/daqian/materialManage/carPlanList';
import tileManage from '@/views/daqian/materialManage/tileManage';
import operationStageManager from '@/views/daqian/operationStage/operationStageManager';
import assignments from '@/views/daqian/operationStage/assignments';
import taskPackageList from '@/views/daqian/operationStage/taskPackageList';
import operationTaskList from '@/views/daqian/operationStage/operationTaskList';
import machineQualityCheckList from '@/views/daqian/operationStage/machineQualityCheckList';
import qualityCheckList from '@/views/daqian/operationStage/qualityCheckList';
import randomCheckList from '@/views/daqian/operationStage/randomCheckList';
import autoProcessManager from '@/views/daqian/autoProcess/autoProcessManager';
import preProcess from '@/views/daqian/autoProcess/preProcess';
import postPreProcess from '@/views/daqian/autoProcess/postPreProcess';
import operationPostProcess from '@/views/daqian/autoProcess/operationPostProcess';
import resultManager from '@/views/daqian/resultLibrary/resultManager';
import resultLibrary from '@/views/daqian/resultLibrary/resultLibrary';
import masterLibraryList from '@/views/daqian/resultLibrary/masterLibraryList';
import masterLibraryTileList from '@/views/daqian/resultLibrary/masterLibraryTileList';
import ReturnLibrary from '@/views/daqian/resultLibrary/ReturnLibrary';
import systemManager from '@/views/daqian/systemManage/systemManager';
import onlineToolsLeft from '@/views/daqian/onlineTools/onlineToolsLeft';
import listMode from '@/views/daqian/onlineTools/listMode';
import checkRuleConfig from '@/views/daqian/systemManage/checkRuleConfig';
import userList from '@/views/daqian/systemManage/userList';

Vue.use(Router);
export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: login
        }, {
            path: '/index',
            name: 'index',
            component: index
        }, {
            path: '/daqian',
            name: 'daqian',
            component: daqian,
            redirect: {
                name: 'projectManager'
            },
            children: [{
                path: '/daqian/projectManage',
                name: 'projectManager',
                component: projectManager,
                redirect: {
                    name: 'projectList'
                },
                children: [{
                    path: '/daqian/projectManage/productionMonitor',
                    name: 'productionMonitor',
                    component: productionMonitor
                }, {
                    path: '/daqian/projectManage/projectList',
                    name: 'projectList',
                    component: projectList
                }, {
                    path: '/daqian/projectManage/projectProgress',
                    name: 'projectProgress',
                    component: projectProgress
                }]
            }, {
                path: '/daqian/materialManage',
                name: 'materialManager',
                component: materialManager,
                redirect: {
                    name: 'carPlanList'
                },
                children: [{
                    path: '/daqian/materialManage/carPlanList',
                    name: 'carPlanList',
                    component: carPlanList
                }, {
                    path: '/daqian/materialManage/tileManage',
                    name: 'tileManage',
                    component: tileManage
                }]
            }, {
                path: '/daqian/autoProcessManage',
                name: 'autoProcessManager',
                component: autoProcessManager,
                redirect: {
                    name: 'preProcess'
                },
                children: [{
                    path: '/daqian/autoProcessManage/preProcess',
                    name: 'preProcess',
                    component: preProcess
                }, {
                    path: '/daqian/autoProcessManage/postPreProcess',
                    name: 'postPreProcess',
                    component: postPreProcess
                }, {
                    path: '/daqian/autoProcessManage/operationPostProcess',
                    name: 'operationPostProcess',
                    component: operationPostProcess
                }]
            }, {
                path: '/daqian/operationStageManage',
                name: 'operationStageManager',
                component: operationStageManager,
                redirect: {
                    name: 'assignments'
                },
                children: [{
                    path: '/daqian/operationStageManage/assignments',
                    name: 'assignments',
                    component: assignments
                }, {
                    path: '/daqian/operationStageManage/taskPackageList',
                    name: 'taskPackageList',
                    component: taskPackageList
                }, {
                    path: '/daqian/operationStageManage/operationTaskList',
                    name: 'operationTaskList',
                    component: operationTaskList
                }, {
                    path: '/daqian/operationStageManage/machineQualityCheckList',
                    name: 'machineQualityCheckList',
                    component: machineQualityCheckList
                }, {
                    path: '/daqian/operationStageManage/qualityCheckList',
                    name: 'qualityCheckList',
                    component: qualityCheckList
                }, {
                    path: '/daqian/operationStageManage/randomCheckList',
                    name: 'randomCheckList',
                    component: randomCheckList
                }]
            }, {
                path: '/daqian/resultManage',
                name: 'resultManager',
                component: resultManager,
                redirect: {
                    name: 'masterLibraryList'
                },
                children: [{
                    path: '/daqian/resultManage/resultLibrary',
                    name: 'resultLibrary',
                    component: resultLibrary
                }, {
                    path: '/daqian/resultManage/masterLibraryList',
                    name: 'masterLibraryList',
                    component: masterLibraryList
                }, {
                    path: '/daqian/resultManage/masterLibraryTileList',
                    name: 'masterLibraryTileList',
                    component: masterLibraryTileList
                }, {
                    path: '/daqian/resultManage/ReturnLibrary',
                    name: 'ReturnLibrary',
                    component: ReturnLibrary
                }]
            }, {
                path: '/daqian/systemManage',
                name: 'systemManager',
                component: systemManager,
                redirect: {
                    name: 'checkRuleConfig'
                },
                children: [{
                    path: '/daqian/systemManage/checkRuleConfig',
                    name: 'checkRuleConfig',
                    component: checkRuleConfig
                }, {
                    path: '/daqian/systemManage/userList',
                    name: 'userList',
                    component: userList
                }]
            }, {
                path: '/daqian/onlineTools',
                name: 'onlineToolsLeft',
                component: onlineToolsLeft,
                redirect: {
                    name: 'listMode'
                },
                children: [{
                    path: '/daqian/onlineTools/listMode',
                    name: 'listMode',
                    component: listMode
                // }, {
                //     path: '/daqian/systemManage/userList',
                //     name: 'userList',
                //     component: userList
                }]
            }]
        }
    ]
});
