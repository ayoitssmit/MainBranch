import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (code) {
      // Redirect to a client-side page to handle the API call and loading state
      redirect(`/auth-callback?code=${code}`);
  } else {
      redirect('/login?error=no_code');
  }
}
