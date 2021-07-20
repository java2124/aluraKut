import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    
    if(request.method === 'POST'){
        const TOKEN = 'b7dc1694f62978ae71a4e8c3bf4202';
        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
            itemType: "968551",
            ...request.body,
        })
        
        response.json({
            dados: "Algum dado qualquer",
            registroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}