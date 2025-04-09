"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe('Task API', () => {
    it('should create a new task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Test task' });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test task');
    }));
    it('should return 400 if title is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({});
        expect(res.statusCode).toBe(400);
    }));
    it('should get all tasks', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('should update a task', () => __awaiter(void 0, void 0, void 0, function* () {
        const create = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Update me' });
        const update = yield (0, supertest_1.default)(index_1.default).put(`/tasks/${create.body.id}`).send({ title: 'Updated', done: true });
        expect(update.statusCode).toBe(200);
        expect(update.body.title).toBe('Updated');
        expect(update.body.done).toBe(true);
    }));
    it('should not update a non-existing task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).put('/tasks/999').send({ title: 'Nope' });
        expect(res.statusCode).toBe(404);
    }));
    it('should delete a task', () => __awaiter(void 0, void 0, void 0, function* () {
        const create = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Delete me' });
        const res = yield (0, supertest_1.default)(index_1.default).delete(`/tasks/${create.body.id}`);
        expect(res.statusCode).toBe(204);
    }));
    it('should not delete a non-existing task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).delete('/tasks/9999');
        expect(res.statusCode).toBe(404);
    }));
    it('should filter tasks by query', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Buy milk' });
        yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Buy coffee' });
        const res = yield (0, supertest_1.default)(index_1.default).get('/tasks?q=milk');
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title.toLowerCase()).toContain('milk');
    }));
    it('should toggle done status', () => __awaiter(void 0, void 0, void 0, function* () {
        const create = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'To toggle' });
        const toggle = yield (0, supertest_1.default)(index_1.default).put(`/tasks/${create.body.id}`).send({ done: true });
        expect(toggle.body.done).toBe(true);
    }));
    it('should keep other fields when toggling done', () => __awaiter(void 0, void 0, void 0, function* () {
        const create = yield (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Preserve title' });
        const toggle = yield (0, supertest_1.default)(index_1.default).put(`/tasks/${create.body.id}`).send({ done: true });
        expect(toggle.body.title).toBe('Preserve title');
    }));
});
