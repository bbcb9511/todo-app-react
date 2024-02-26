import { Box, Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { optionOfStatus, todoListState } from '../states/state';
import { TodoType } from '../types/TodoType';
import { useForm } from 'react-hook-form';


const TodoForm = (props: any) => {
  const {title, status, detail} = props.todoColumnName
  const optionListOfStatus = useRecoilValue(optionOfStatus)
  const [todoList, setTodoList] = useRecoilState(todoListState)
  const {register, handleSubmit, reset, formState:{errors}} = useForm<TodoType>();


  const onSubmit = (data: TodoType) => {
    fetch('http://localhost:8080/newtodo', {
      method: 'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({
        todoTitle: data.todoTitle,
        todoStatus: data.todoStatus,
        todoDetail: data.todoDetail
      })
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Todoの登録に失敗しました。')
      }
      return fetch('http://localhost:8080/todos')
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('データの取得に失敗しました。')
      }
      return response.json()
    })
    .then(data => {
      setTodoList(data)
    })
    .catch(error => {
      alert('エラー：' + error)
    });

    reset()  //フォームの入力値をリセット
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <Box m={'30px'}>
      <FormControl isInvalid={!!errors.todoTitle}>
        <FormLabel>{title}</FormLabel>
        <Input type='text' placeholder='入力してください' {...register('todoTitle', {required: true})} />
        <Box color={'red'}>{!!errors.todoTitle && <p>入力してください</p>}</Box>
      </FormControl>

      <FormControl isInvalid={!!errors.todoStatus}>
        <FormLabel>{status}</FormLabel>
        <Select placeholder='選択してください' {...register('todoStatus', {required: '選択してください'})}>
          {optionListOfStatus.map( val => <option value={val}>{val}</option>)}
        </Select>                    
        <Box color={'red'}>{errors.todoStatus && errors.todoStatus.message}</Box>
      </FormControl>

      <FormControl isInvalid={!!errors.todoDetail}>
        <FormLabel>{detail}</FormLabel>
        <Input type='text' placeholder='入力してください' {...register('todoDetail', {required: true})} />
        <Box color={'red'}>{!!errors.todoDetail && <p>入力してください</p>}</Box>
      </FormControl>

      <Button type='submit' m={'10px'} border={'1px solid'} borderColor={'gray.400'}>登録</Button>
    </Box>
  </form>
)
}

export default TodoForm