import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import TodoContainer from './components/TodoContainer';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <TodoContainer />;
}
