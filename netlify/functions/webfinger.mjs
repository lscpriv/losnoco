async function handler(resource) {

    if (!resource) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing 'resource' query parameter" }),
        };
    }

    const validAccounts = {
        "acct:kevin@losno.co": {
            subject: "acct:kevin@losno.co",
            links: [
                {
                    rel: "self",
                    href: "https://kddlb.cl",
                },
            ],
        },
        "acct:chris@losno.co": {
            subject: "acct:chris@losno.co",
            links: [
                {
                    rel: "self",
                    href: "https://kode54.net",
                },
            ],
        },
    };

    const account = validAccounts[resource];

    if (!account) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Account not found" }),
        };
    }

    account.links.push({
        "rel": "http://openid.net/specs/connect/1.0/issuer",
        "href": "https://auth.losno.co/realms/LoSnoCo"
    })

    return {
        statusCode: 200,
        body: JSON.stringify(account),
    };
}

export default async (req, context) => {
    /*var resp = await handler(req);
    return Response.json(resp);*/
    
    //get query parameters from context url
    const url = new URL(req.url);
    const params = url.searchParams;
    const resource = params.get("resource");
    const result = await handler(resource);
    return new Response(result.body, {
        status: result.statusCode, 
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
};

export const config = {
  path: "/.well-known/webfinger",
};