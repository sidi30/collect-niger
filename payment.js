// Configuration HelloAsso
// URL directe vers la page de paiement HelloAsso
const HELLOASSO_PAYMENT_URL = 'https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16';

// Styles CSS pour HelloAsso
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .payment-container {
      width: 100%;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
    }
    .payment-iframe-container {
      position: relative;
      width: 100%;
      height: 500px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .payment-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .payment-button-container {
      width: 100%;
      height: 70px;
      overflow: hidden;
      margin-top: 20px;
    }
  `;
  document.head.appendChild(style);
});

// Fonction pour préparer les données de paiement
function preparePaymentData() {
  // Calcul du montant total du panier
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Préparer la description détaillée des articles achetés
  let description = "Don pour les fournitures scolaires au Niger";
  let detailedItems = [];
  
  // Créer une liste détaillée des articles
  if (cart.length > 0) {
    cart.forEach(item => {
      if (item.id === 'free-donation') {
        detailedItems.push(`Don libre: ${item.price}€`);
      } else {
        detailedItems.push(`${item.name} x ${item.quantity} (${(item.price * item.quantity).toFixed(2)}€)`);
      }
    });
    
    if (cart.length === 1) {
      description = detailedItems[0];
    } else {
      description = detailedItems.join(' + ');
    }
    
    // Si la description est trop longue, la tronquer
    if (description.length > 100) {
      description = `${cart.length} articles pour les élèves du Niger - Total: ${total.toFixed(2)}€`;
    }
  }
  
  // Nom du donateur si fourni
  const donorName = document.getElementById('donor-name')?.value || '';
  
  return {
    amount: total.toFixed(2),
    description: description,
    items: detailedItems,
    donorName: donorName || 'Anonyme'
  };
}

// Gestion de la soumission du formulaire de paiement
function handlePaymentSubmit(e) {
  if (e) e.preventDefault();
  
  // Préparer les données
  const paymentData = preparePaymentData();
  
  // Rediriger vers HelloAsso avec le montant
  redirectToHelloAsso(paymentData.amount);
}

// Fonction pour rediriger vers HelloAsso avec le montant
function redirectToHelloAsso(amount) {
  const amountInCents = parseInt(parseFloat(amount) * 100);
  
  // Afficher le message de chargement avant redirection
  document.getElementById('payment-loading').style.display = 'block';
  document.getElementById('payment-form').style.display = 'none';
  document.getElementById('payment-loading').innerHTML = `
    <div class="p-4 text-center">
      <img src="https://www.helloasso.com/assets/img/logos/helloasso_positive.svg" alt="HelloAsso" class="h-12 mx-auto mb-4">
      <p class="text-green-600 text-xl font-bold mb-2">Montant: ${amount}€</p>
      <p class="text-gray-600 mb-4">Redirection vers HelloAsso en cours...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
    </div>
  `;
  
  // Construire l'URL avec le montant
  let finalUrl = `${HELLOASSO_PAYMENT_URL}?amount=${amountInCents}`;
  
  // Rediriger vers HelloAsso après un court délai
  setTimeout(() => {
    window.location.href = finalUrl;
  }, 1000);
}

// Affichage du message de succès
function showPaymentSuccess() {
  document.getElementById('payment-form').style.display = 'none';
  document.getElementById('payment-success').style.display = 'block';
  
  // Vider le panier après paiement
  cart = [];
  updateCart();
  
  // Fermer la modal après 5 secondes
  setTimeout(() => {
    closePaymentModal();
  }, 5000);
}

// Ouverture de la modal de paiement pour confirmation avant redirection
function openPaymentModal() {
  // Vérifier si le panier est vide
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }
  
  // Si la modal existe, l'afficher
  const paymentModal = document.getElementById('payment-modal');
  const overlay = document.getElementById('overlay');
  
  if (paymentModal && overlay) {
    paymentModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Préparer la modal pour confirmation
    document.getElementById('payment-loading').style.display = 'none';
    document.getElementById('payment-form').style.display = 'block';
    document.getElementById('payment-success').style.display = 'none';
    
    // Calculer le total du panier
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Afficher le montant total dans la modal
    const paymentTotalElement = document.getElementById('payment-total');
    if (paymentTotalElement) {
      paymentTotalElement.textContent = total.toFixed(2) + '€';
    }
  }
}

// Fermeture de la modal de paiement
function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Fonction pour ajouter le bouton HelloAsso dans la page
function addHelloAssoButton(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Créer un conteneur pour le bouton
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'payment-button-container';
    
    // Ajouter l'iframe du bouton HelloAsso
    buttonContainer.innerHTML = `
      <iframe 
        id="haWidget" 
        allowtransparency="true" 
        src="https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16/widget-bouton" 
        style="width: 100%; height: 70px; border: none;">
      </iframe>
    `;
    
    // Ajouter le bouton au conteneur
    container.appendChild(buttonContainer);
  }
}

// Variables globales pour le panier et les montants
let cart = [];
let totalAmount = 0;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Ajouter un gestionnaire d'événement pour le bouton de paiement
  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      openPaymentModal();
    });
    console.log('Gestionnaire d\'événement ajouté au bouton de paiement');
  } else {
    console.error('Bouton de paiement non trouvé');
  }
});

// Affichage du message de succès
function showPaymentSuccess() {
  document.getElementById('payment-form').style.display = 'none';
  document.getElementById('payment-success').style.display = 'block';
  
  // Vider le panier après paiement
  cart = [];
  updateCart();
  
  // Fermer la modal après 5 secondes
  setTimeout(() => {
    closePaymentModal();
  }, 5000);
}

// Fonction pour configurer les boutons de paiement
function setupPaymentButtons() {
  const payNowButton = document.getElementById('pay-now-button');
  if (payNowButton) {
    payNowButton.addEventListener('click', openPaymentModal);
  }
}

// Ajout des écouteurs d'événements une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  // Gérer la fermeture de la modal
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', closePaymentModal);
  });
  
  // Gérer le bouton "Payer maintenant" du panier
  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', openPaymentModal);
  }
  
  // Configuration du bouton HelloAsso dans la modal
  const paymentRedirectBtn = document.getElementById('payment-redirect');
  if (paymentRedirectBtn) {
    paymentRedirectBtn.addEventListener('click', handlePaymentSubmit);
  }
});
