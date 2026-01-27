"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const worker_threads_1 = require("worker_threads");
const os_1 = require("os");
const path = __importStar(require("path"));
/**
 * CompositionService
 * High-performance API aggregator optimized for 2k req/s.
 * Implements Worker Threads to offload CPU-intensive serialization,
 * ensuring Event Loop stability and sub-400ms p99 latency.
 */
let CompositionService = class CompositionService {
    constructor(logger) {
        this.logger = logger;
        this.pendingTasks = new Map();
        this.currentTaskId = 0;
        this.nextTaskIdToResolve = 0;
        this.workerPath = path.join(__dirname, '../workers/composition.worker.js');
        this.startWorker();
    }
    startWorker() {
        if ((0, os_1.cpus)().length >= 2) {
            this.worker = new worker_threads_1.Worker(this.workerPath);
            this.worker.on('message', (data) => this.handleWorkerMessage(data));
            this.worker.on('error', (err) => {
                this.logger.error('Worker Failure:', err);
                this.startWorker();
            });
            this.worker.on('exit', (code) => {
                if (code !== 0) {
                    this.logger.warn('Worker terminated. Re-initializing...');
                    this.startWorker();
                }
            });
        }
    }
    handleWorkerMessage({ taskId, result, error }) {
        const task = this.pendingTasks.get(taskId);
        if (!task)
            return;
        if (error)
            task.reject(error);
        else
            task.resolve(result);
        this.pendingTasks.delete(taskId);
        this.processPendingTasks();
    }
    async processPendingTasks() {
        while (this.pendingTasks.has(this.nextTaskIdToResolve)) {
            this.nextTaskIdToResolve++;
        }
    }
    async compose(payload) {
        return new Promise((resolve, reject) => {
            const taskId = this.currentTaskId++;
            this.pendingTasks.set(taskId, { resolve, reject });
            this.worker?.postMessage({ taskId, ...payload });
        });
    }
};
CompositionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger])
], CompositionService);
exports.default = CompositionService;
