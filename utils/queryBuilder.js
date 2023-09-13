export function generateProductQuery(excludedIds, searchQuery) {
    let query = '';
  
    if (Array.isArray(excludedIds) && excludedIds.length > 0) {
      query = `(NOT id:${excludedIds[0]})`;
  
      if (excludedIds.length > 1) {
        query += excludedIds
          .slice(1)
          .map((id, index) => `${index !== excludedIds.length - 1 ? ' AND' : ''} (NOT id:${id})`)
          .join('');
      }
    }
  
    if (searchQuery) {
      query += query ? ` AND ${searchQuery}` : searchQuery;
    }
  
    return query;
  }


  export function generateSelectedProductIdsQuery(productIds){
    if(!Array.isArray(productIds) ||  productIds.length == 0 )return '';
    let query = '';
    productIds.forEach((id)=>{
      query+= `id:${id} OR `
    })
    return query;
  } 