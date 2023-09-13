export async function initializeSettings(fetch, shop, zone){
    const response = await fetch(`/api/settings/initialize`,{
        method:'POST',
        headers:{
            'Content-Type':' application/json'
        },
        body:JSON.stringify({shop, zone})
    })
    const res = await response.json()
    console.log(res)
    return res
}


export async function updateSettings(fetch, shop, settings){
    console.log('updated', settings)
    const response = await fetch(`/api/settings/update?shopId=${shop}`, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({settings})
    })
    const res = await response.json()
    return res
}