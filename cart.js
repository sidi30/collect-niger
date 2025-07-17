// Initialisation du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Éléments du DOM
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const overlay = document.getElementById('overlay');
const paymentModal = document.getElementById('payment-modal');
const checkoutButton = document.getElementById('checkout-button');

// Mise à jour de l'affichage du panier
function updateCart() {
  // Sauvegarder dans localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Mettre à jour le compteur du panier
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Changer la couleur si le panier n'est pas vide
    if (totalItems > 0) {
      cartButton.classList.add('text-blue-500');
    } else {
      cartButton.classList.remove('text-blue-500');
    }
  }
  
  // Mettre à jour le contenu du panier si la modal est présente
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-6">
          <i class="fas fa-shopping-basket text-gray-400 text-4xl mb-3"></i>
          <p class="text-gray-500">Votre panier est vide</p>
        </div>
      `;
      if (checkoutButton) checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      let items = '';
      let total = 0;
      
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        items += `
          <div class="cart-item flex justify-between items-center py-3 border-b border-gray-100">
            <div class="flex-1">
              <h4 class="text-gray-800 font-medium">${item.name}</h4>
              <div class="flex items-center mt-1">
                <button class="quantity-btn decrease-btn px-2 text-gray-500 hover:text-blue-500" data-index="${index}">
                  <i class="fas fa-minus-circle"></i>
                </button>
                <span class="px-2">${item.quantity}</span>
                <button class="quantity-btn increase-btn px-2 text-gray-500 hover:text-blue-500" data-index="${index}">
                  <i class="fas fa-plus-circle"></i>
                </button>
              </div>
            </div>
            <div class="text-right">
              <div class="text-gray-800 font-bold">${itemTotal.toFixed(2)}€</div>
              <button class="remove-item text-red-500 hover:text-red-700 text-sm mt-1" data-index="${index}">
                <i class="fas fa-trash-alt mr-1"></i> Supprimer
              </button>
            </div>
          </div>
        `;
      });
      
      cartItems.innerHTML = items;
      if (checkoutButton) checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
      
      // Mise à jour du total
      if (cartTotal) cartTotal.textContent = `${total.toFixed(2)}€`;
      
      // Ajout des événements pour les boutons + et -
      document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
      });
      
      // Ajout des événements pour les boutons supprimer
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
      });
    }
  }
}

// Gestion des changements de quantité
function handleQuantityChange(e) {
  const index = parseInt(e.currentTarget.dataset.index);
  const item = cart[index];
  
  if (e.currentTarget.classList.contains('increase-btn')) {
    item.quantity += 1;
  } else if (e.currentTarget.classList.contains('decrease-btn')) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }
  
  updateCart();
}

// Suppression d'un article du panier
function handleRemoveItem(e) {
  const index = parseInt(e.currentTarget.dataset.index);
  cart.splice(index, 1);
  updateCart();
}

// Ajout d'un article au panier
function addToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  updateCart();
  
  // Afficher une notification
  showNotification(`${item.name} ajouté au panier`);
}

// Afficher une notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate__animated animate__fadeIn';
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-3 text-xl"></i>
      <p>${message}</p>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.classList.add('animate__fadeOut');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Ouverture et fermeture de la modal du panier
function toggleCartModal() {
  if (cartModal.classList.contains('hidden')) {
    cartModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  } else {
    closeCartModal();
  }
}

// Fermeture de la modal du panier
function closeCartModal() {
  if (cartModal) {
    cartModal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Gestionnaire d'événement pour les boutons d'articles
function setupItemButtons() {
  const addItemButtons = document.querySelectorAll('.add-item-btn');
  
  addItemButtons.forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.dataset.id;
      const itemName = this.dataset.name;
      const itemPrice = parseFloat(this.dataset.price);
      
      const item = {
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: 1
      };
      
      addToCart(item);
    });
  });
  
  // Ajouter des gestionnaires d'événements pour les articles de fournitures
  const buyButtons = document.querySelectorAll('.buy-button');
  buyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.item-card');
      if (card) {
        const itemId = card.dataset.id;
        const itemName = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.price').textContent;
        const itemPrice = parseFloat(priceText.replace('€', ''));
        
        const item = {
          id: itemId,
          name: itemName,
          price: itemPrice,
          quantity: 1
        };
        
        addToCart(item);
      }
    });
  });
}

// Gestionnaire pour les boutons de don
function setupDonationButtons() {
  const donationButtons = document.querySelectorAll('.donation-button');
  
  donationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const amount = parseFloat(this.dataset.amount);
      
      // Redirection directe vers HelloAsso
      window.location.href = `https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16?amount=${amount * 100}`;
    });
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser le panier
  updateCart();
  
  // Configurer le bouton du panier
  if (cartButton) {
    cartButton.addEventListener('click', toggleCartModal);
  }
  
  // Configurer les boutons de fermeture de modal
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      closeCartModal();
      if (paymentModal) {
        paymentModal.classList.add('hidden');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });
  
  // Configurer le bouton de paiement
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      if (cart.length === 0) {
        alert("Votre panier est vide");
        return;
      }
      
      // Calculer le total du panier
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Rediriger vers HelloAsso
      window.location.href = `https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16?amount=${Math.round(total * 100)}`;
    });
  }
  
  // Configurer les boutons d'articles
  setupItemButtons();
  
  // Configurer les boutons de don directs
  setupDonationButtons();
});
