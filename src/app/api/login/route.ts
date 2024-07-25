import { handleLogin } from '../../lib/actions';
import { serialize } from 'cookie';

export async function POST(req:Request){
  const data = await req.json();
  const result = await handleLogin(null, data);

  if (result.message !== 'Login successful') {
    return Response.json({
      result
    }, {status: 400});
  }
    
  const user = result.user;
  
  return Response.json({
    message: 'Login successful',
      user
  }, {
    headers: {
      'Set-Cookie': serialize('user', JSON.stringify(user), { path: '/' })
    },
    status: 200
  })
}