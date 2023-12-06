import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isErrorOrder: false,
    isSuccessOrder: false,
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
            if (itemOrder) {
                if (itemOrder.amount <= itemOrder.countInStock) {
                    itemOrder.amount += orderItem?.amount
                    state.isSuccessOrder = true
                    state.isErrorOrder = false

                } else {
                    state.isErrorOrder = true
                }
            } else {
                state.orderItems.push(orderItem)
                state.isSuccessOrder = true
            }
        },
        resetOrder: (state) => {
            state.isSuccessOrder = false
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload

            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct)

            state.orderItems = itemOrder;
            state.orderItemsSelected = itemOrderSelected;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload

            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
            const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked.includes(item.product))

            state.orderItems = itemOrders
            state.orderItemsSelected = itemOrdersSelected

        },
        selectedOrder: (state, action) => {
            // console.log('selected', action.payload)
            const { listChecked } = action.payload
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order.product)) {
                    orderSelected.push(order)
                };
            });
            state.orderItemsSelected = orderSelected
        },
        setOrderItems: (state, action) => {
            state.orderItems = action.payload;
            state.isSuccessOrder = false;
            state.isErrorOrder = false;
        },
        resetOrder1: (state) => {
            state.orderItems = [];
            state.isSuccessOrder = false;
            state.isErrorOrder = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder, resetOrder, setOrderItems, resetOrder1 } = orderSlide.actions

export default orderSlide.reducer