export const addPreset = async (fetch, payload) => {
  try {
    const response = await fetch(`/api/presets/add-preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const deletePreset = async (fetch, id, shopId) => {
  try {
    const response = await fetch(`/setup/deletepreset?id=${id}&shopId=${shopId}`,{
      method:'DELETE'
    });
    const res = await response.json();
    if(res.message){
      return res;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const updatePreset = async (fetch,data) => {
  try {
    const response = await fetch(`/setup/updatePreset`,{
      method:'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    });
    const res = await response.json();
    if(res.message){
      return res;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getProducts = async (fetch, pageInfo, searchValue) => {
  const { afterCursor, hasNextPage } = pageInfo;
  const pageSize = 50;
  try {
    const response = await fetch(
      `/api/presets/get-products?pageSize=${pageSize}&afterCursor=${afterCursor}&hasNextPage=${hasNextPage}&query=${searchValue}`
    );
    const res = await response.json();
    const products  = res?.edges
    return {edges:products, pageInfo:res.pageInfo};
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const getSelectedProducts = async (fetch, productIds) => {
  try {
    const response = await fetch(
      `/api/presets/get-selected-products`,
      {
        method:"POST",
        body:JSON.stringify({productIds}),
        headers:{
          'Content-Type':'application/json'
        }
      }
    );
    const res = await response.json();
    if(!res.message) return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const getPresets = async (fetch, shop) => {
  try {
    const response = await fetch(
      `/api/presets/get-presets`
    );
    const res = await response.json();
    return res
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

