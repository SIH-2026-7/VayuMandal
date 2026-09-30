import {simulate,validateConfig} from '@/lib/weather-engine';
export async function GET(request:Request){try{return Response.json(simulate(validateConfig(Object.fromEntries(new URL(request.url).searchParams))),{headers:{'Cache-Control':'no-store'}})}catch(e){return Response.json({error:(e as Error).message},{status:400})}}
