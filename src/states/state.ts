import { atom } from "recoil";
import { TodoType } from "../types/TodoType";

export const optionOfFilter = atom<string[]>({
    key: 'optionOfFilter',
    default: ['すべて', '未着手', '対応中', '完了']
});

export const optionOfStatus = atom<string[]>({
    key: 'optionOfStatus',
    default: ['未着手', '対応中', '完了']
})

export const todoListState = atom<TodoType[]>({
    key: 'todoListState',
    default: []
})

export const filterdTodoListState = atom<TodoType[]>({
    key: 'filterdTodoListState',
    default: []
})
