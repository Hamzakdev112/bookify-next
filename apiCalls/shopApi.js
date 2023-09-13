export const getShop = async (fetch)=>{
    try{
        const response = await fetch(`/shop`);
          const shop = await response.json();
          return shop;
    }
    catch(err){

    }
}