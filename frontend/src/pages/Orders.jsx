// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title';
// import axios from 'axios';
// import statusThai from '../context/statusThai';

// const Orders = () => {

//   const { backendUrl, token, currency } = useContext(ShopContext);

//   const [orderData,setorderData] = useState([])

//   const loadOrderData = async () => {
//     try {
//       if (!token) {
//         return null
//       }

//       const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
//       console.log("API response:", response.data.orders);
//       if (response.data.success) {
//         let allOrdersItem = []
//         response.data.orders.map((order)=>{
//           order.items.map((item)=>{
//             item['status'] = order.status
//             item['payment'] = order.payment          
//             item['paymentMethod'] = order.paymentMethod          
//             item['date'] = order.date
//             allOrdersItem.push(item)          
//           })
//         })
//         setorderData(allOrdersItem.reverse());
        
//       }
      
//     } catch (error) {
      
//     }
//   }

//   useEffect(()=>{
//     loadOrderData()
//   },[token])

//   return (
//     <div className='border-t border-gray-300 pt-16'>
      
//       <div className='text-2xl'>
//         <Title text2={'รายการสั่งซื้อ'}/>
//       </div>

//       <div>
//           {
//             orderData.map((item,index)=>(
//               <div key={index} className='py-4 border-t border-b border-gray-300 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
//                   <div className='flex items-start gap-6 text-sm'>
//                       <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
//                       <div>
//                         <p className='sm:text-base font-medium'>{item.name}</p>
//                         <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
//                           <p>{currency}{item.price}</p>
//                           <p>จำนวน: {item.quantity}</p>
//                           <p>ขนาด: {item.size}kg</p>
//                         </div>
//                         <p className='mt-1'>วันที่สั่งซื้อ: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
//                         <p className='mt-1'>การเก็บเงิน: <span className='text-gray-400'>{item.paymentMethod}</span></p>
//                       </div>
//                   </div>
//                   <div className='md:w-1/2 flex justify-between'>
//                       <div className='flex items-center gap-2'>
//                           <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
//                           <p className='text-sm md:text-base'>{statusThai[item.status]}</p>
//                       </div>
//                       <button onClick={loadOrderData} className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm'>ติดตามการสั่งซื้อ</button>
//                   </div>
//               </div>
//             ))
//           }
//       </div>
//     </div>
//   )
// }

// export default Orders