export function updateOrder(orderId, newType, newQuantity) {
    return   fetch(`https://localhost:7039/api/Order/Patch`, {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               orderID: orderId,
               ticketCategoryid: newType,
               numberOfTickets: newQuantity,
           })
       }).then(response => 
           { 
               if(response.status === 200){
                  toastr.success('Order updated successfully');
               } else {
                   toastr.error('Error updating order');
               }
   
               return response;
           }).catch(error => {
              throw new Error(error);
           });
   }