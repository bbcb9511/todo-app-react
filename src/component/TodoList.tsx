import { Box, Button, Flex, FormLabel, Heading, Input, List, ListItem, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterdTodoListState, optionOfFilter, optionOfStatus, todoListState } from '../states/state';
import { TodoType } from '../types/TodoType';


const TodoList = (props: any) => {
    const {status, detail} = props.todoColumnName
    const optionListOfFilter = useRecoilValue(optionOfFilter)
    const optionListOfStatus = useRecoilValue(optionOfStatus)
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [filterdTodoList, setFilterdTodoList] = useRecoilState(filterdTodoListState)
    const [filterValue, setFilterValue] = useState<string>('すべて');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [editTodoId, setEditTodoId] = useState<number | null | undefined>(null);
    const [editingTodo, setEditingTodo] = useState<TodoType>();
  

    const onChangeFilter = (e:  React.ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(e.target.value)
        const targetTodoList = todoList.filter(todo => e.target.value === 'すべて' ? true : todo.todoStatus === e.target.value)
        setFilterdTodoList(targetTodoList)
    }
    
    const fetchTodoList = () => {
        fetch('http://localhost:8080/todos')
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('データの取得に失敗しました。')            
            }
        })
        .then(data => setTodoList(data))
        .catch(error => alert('エラー：' + error));
    }

    const onClickComplete = (targetTodoId: number | undefined) => {
        const updateTodoUrl = 'http://localhost:8080/' + targetTodoId
        fetch(updateTodoUrl, {
            method: 'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(editingTodo)
        })
        .then(response => {
            if(response.ok){
                fetchTodoList()
            } else {
                throw new Error('更新リクエストが失敗しました。')
            }
        })
        .catch(error => alert('エラー：' + error));
    
        setIsEdit(false)
        setEditTodoId(null)
    }

    const onClickDelete = (deleteTargetId: number | undefined) => {
        const deleteTodoUrl =  'http://localhost:8080/' + deleteTargetId
        fetch(deleteTodoUrl, {
            method: 'DELETE'
        })
        .then(response => {
            if(response.ok){
                fetchTodoList()
            } else {
                throw new Error('削除リクエストが失敗しました。')
            }
        })
        .catch(error => {
            alert('エラー：' + error)
        });
    }
    
    const onClickEdit = (targetTodoId: number | undefined) => {
        setIsEdit(true)
        setEditTodoId(targetTodoId)
    }
    
    useEffect(() => {
        fetchTodoList()
      },[]);

    useEffect(() => {
        const targetTodoList = todoList.filter(todo => filterValue === 'すべて' ? true : todo.todoStatus === filterValue)
        setFilterdTodoList(targetTodoList)
    }, [todoList])
  
    

    return (
        <Box m='30px' px={'40px'} py={'10px'} rounded='lg' bg='blue.50' >
            <Heading as='h2' fontWeight='bold' fontSize={'25px'} textAlign={'center'}>
                ToDo一覧
            </Heading>

            <Flex textAlign={'center'} alignItems={'center'} mb={'20px'}>
                <FormLabel w={'100px'}>フィルター：</FormLabel>
                <Select w={'120px'} defaultValue='すべて' onChange={(e) => onChangeFilter(e)}>
                    {optionListOfFilter.map( val => <option value={val}>{val}</option>)}
                </Select>   
            </Flex>
            <Box borderBottom="1px solid gray"></Box>

            <List spacing={5}>
                {filterdTodoList.map(todo => 
                    (isEdit && todo.todoId === editTodoId)? 
                    // 編集時のToDoの表示
                    (
                        <ListItem>
                            <Flex textAlign={'center'} alignItems={'center'} my={'10px'}>
                                ●<Input defaultValue={todo.todoTitle} onChange={(e) => setEditingTodo({...editingTodo, todoTitle: e.target.value})} />
                                <Button border={'1px solid'} borderColor={'gray.400'} height={'30px'} ml={'20px'} onClick={() => onClickComplete(todo.todoId)} >保存</Button>
                            </Flex>
                            <Box pl={'20px'}>
                                <Flex alignItems={'center'}>
                                    <Box w={'150px'}>【{status}】</Box>
                                    <Select defaultValue={todo.todoStatus} onChange={(e) => setEditingTodo({...editingTodo, todoStatus: e.target.value})} >
                                        {optionListOfStatus.map( val => <option value={val}>{val}</option>)}
                                    </Select>                    
                                </Flex>
                                <Flex alignItems={'center'}>
                                    <Box w={'150px'}>【{detail}】</Box>
                                    <Input defaultValue={todo.todoDetail} onChange={(e) => setEditingTodo({...editingTodo, todoDetail: e.target.value})} />
                                </Flex>
                            </Box>
                        </ListItem>                
                    ) : 
                    // 編集時でないToDoの表示
                    (
                        <ListItem>
                            <Flex textAlign={'center'} alignItems={'center'} my={'10px'}>
                                ●{todo.todoTitle}
                                <Button border={'1px solid'} borderColor={'gray.400'} height={'30px'} ml={'20px'} onClick={() => onClickEdit(todo.todoId)}>編集</Button>
                                <Button border={'1px solid'}  borderColor={'gray.400'} height={'30px'} ml={'20px'} onClick={() => onClickDelete(todo.todoId)}>削除</Button>
                            </Flex>
                            <Box pl={'20px'}>【{status}】{todo.todoStatus}</Box>
                            <Box pl={'20px'}>【{detail}】{todo.todoDetail}</Box>
                        </ListItem>
                    )
                )}
            </List>
        </Box>
    )
}

export default TodoList