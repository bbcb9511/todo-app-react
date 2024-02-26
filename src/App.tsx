import { ChakraProvider } from '@chakra-ui/react';
import TodoForm from './component/TodoForm';
import TodoList from './component/TodoList';
import { RecoilRoot } from 'recoil';

function App() {

  type todoColumnNameType = {
    title: string;
    status: string;
    detail: string;
  }

  const todoColumnName: todoColumnNameType = {
    title: 'Todo名',
    status: 'ステータス',
    detail: '詳細'
  }

  return (
    <RecoilRoot>
      <ChakraProvider>
        <TodoForm todoColumnName={todoColumnName}/>
        <TodoList todoColumnName={todoColumnName}/>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
