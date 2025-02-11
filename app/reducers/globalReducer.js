export const globalReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const {
        itemId,
        selectedColor,
        selectedSize,
        quantity,
        product,
        finalPrice,
      } = action.items;
      const alreadyExist = state.cart.find(
        (cartItem) =>
          cartItem.selectedColor === selectedColor &&
          cartItem.selectedSize === selectedSize &&
          cartItem.product.id === product.id
      );

      if (alreadyExist) {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem.selectedColor === selectedColor ||
            cartItem.selectedSize === selectedSize
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              itemId,
              selectedColor,
              selectedSize,
              quantity,
              product,
              finalPrice,
            },
          ],
        };
      }
    case "CART_QUANTITY_UPDATE":
      if (action.subAction === "increment") {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem.itemId === action.itemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      } else if (action.subAction === "decrement") {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem.itemId === action.itemId
              ? cartItem.quantity > 1
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
        };
      }
    default:
      return {
        ...state,
      };
  }
};
