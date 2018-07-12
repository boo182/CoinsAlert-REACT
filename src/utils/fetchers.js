export const fetcher = async (url, method, body) => {
    if(method === 'POST') {
        return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        })
        .then(res => res.json())
    } else if (method === 'DELETE') {
        fetch(url, {method: 'DELETE'})
        .then(res => res.json())
    } 
    else {
        fetch(url)
        .then(res => res.json());
    }
}