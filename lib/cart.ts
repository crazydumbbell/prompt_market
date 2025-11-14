/**
 * 로컬스토리지 기반 장바구니 관리
 */

const CART_KEY = 'prompt_cart';

export interface CartItem {
  promptId: string;
  addedAt: string;
}

/**
 * 장바구니에 프롬프트 추가
 */
export function addToCart(promptId: string): boolean {
  try {
    const cart = getCart();
    
    // 이미 있는지 확인
    if (cart.some(item => item.promptId === promptId)) {
      return false;
    }
    
    cart.push({
      promptId,
      addedAt: new Date().toISOString(),
    });
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
}

/**
 * 장바구니에서 프롬프트 제거
 */
export function removeFromCart(promptId: string): boolean {
  try {
    const cart = getCart();
    const filtered = cart.filter(item => item.promptId !== promptId);
    localStorage.setItem(CART_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
}

/**
 * 장바구니 전체 조회
 */
export function getCart(): CartItem[] {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

/**
 * 장바구니 비우기
 */
export function clearCart(): void {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

/**
 * 장바구니에 특정 아이템이 있는지 확인
 */
export function isInCart(promptId: string): boolean {
  const cart = getCart();
  return cart.some(item => item.promptId === promptId);
}

/**
 * 장바구니 아이템 개수
 */
export function getCartCount(): number {
  return getCart().length;
}

