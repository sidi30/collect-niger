// Configuration Lydia
// URL exacte de la cagnotte fournie
const LYDIA_COLLECT_URL = 'https://pots.lydia.me/collect/pots?id=19345-soutien-scolaire-niger';

// Styles CSS pour les badges de méthode de paiement
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .payment-method-badge {
      display: inline-block;
      background-color: #f3f4f6;
      color: #4b5563;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin: 0.25rem;
    }
  `;
  document.head.appendChild(style);
});

// Afficher les options de paiement
function showPaymentOptions() {
  // Cacher le chargement et afficher les options
  document.getElementById('payment-loading').style.display = 'none';
  document.getElementById('payment-form').style.display = 'block';
  
  // Mettre à jour le bouton de paiement
  document.getElementById('payment-submit').textContent = 'Continuer vers Lydia';
  document.getElementById('payment-submit').classList.add('bg-purple-500', 'hover:bg-purple-600');
  document.getElementById('payment-submit').classList.remove('bg-blue-500', 'hover:bg-blue-600');
  
  // Ajouter le logo Lydia
  const paymentElement = document.getElementById('payment-element');
  paymentElement.innerHTML = `
    <div class="p-4 text-center">
      <img src="https://www.lydia-app.com/assets/img/logo.svg" alt="Lydia" class="h-12 mx-auto mb-4">
      <p class="text-gray-600 mb-4">Vous allez être redirigé vers Lydia pour finaliser votre don de façon sécurisée.</p>
      <div class="flex flex-wrap justify-center">
        <span class="payment-method-badge">CB</span>
        <span class="payment-method-badge">Lydia</span>
        <span class="payment-method-badge">Apple Pay</span>
        <span class="payment-method-badge">Google Pay</span>
      </div>
    </div>
  `;
}

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
  const donorName = document.getElementById('donor-name').value;
  if (donorName && donorName.trim() !== '') {
    description = `${donorName}: ${description}`;
  }
  
  return {
    amount: total.toFixed(2),
    description: description,
    items: detailedItems,
    donorName: donorName || 'Anonyme'
  };
}

// Gestion de la soumission du formulaire de paiement
function handlePaymentSubmit(e) {
  e.preventDefault();
  
  // Désactiver le bouton pendant le traitement
  document.getElementById('payment-submit').disabled = true;
  document.getElementById('payment-submit').textContent = 'Redirection en cours...';
  
  // Afficher le message de traitement
  document.getElementById('payment-message').textContent = 'Préparation de votre don...';
  document.getElementById('payment-message').classList.remove('hidden');
  
  // Préparer les données
  const paymentData = preparePaymentData();
  
  // Construire l'URL de redirection vers Lydia
  redirectToLydia(paymentData);
}

// Fonction pour rediriger vers Lydia
function redirectToLydia(paymentData) {
  // Récupérer le montant du panier
  const totalAmount = paymentData.amount;
  
  // Construire la description détaillée pour la page Lydia
  let cartDetails = paymentData.items.join('\n');
  
  // Ajouter des informations supplémentaires
  const timestamp = new Date().toLocaleString('fr-FR');
  const donorInfo = paymentData.donorName ? `Donateur: ${paymentData.donorName}` : 'Don anonyme';
  
  // Afficher un récapitulatif dans la console pour debug
  console.log("------ RÉCAPITULATIF DU DON ------");
  console.log("Montant total:", totalAmount, "€");
  console.log("Détails du panier:", cartDetails);
  console.log("Donateur:", paymentData.donorName || 'Anonyme');
  console.log("Date et heure:", timestamp);
  console.log("---------------------------------");
  
  // Construire l'URL Lydia avec le bon format pour préremplir le montant
  // L'URL contient déjà un paramètre '?id=', donc on utilise '&' pour le montant
  let finalUrl = `${LYDIA_COLLECT_URL}&amount=${totalAmount}`;
  
  // Ajouter la description avec une limite de caractères
  if (paymentData.description) {
    finalUrl += `&message=${encodeURIComponent(paymentData.description)}`;
  }
  
  // Afficher une confirmation avant redirection
  document.getElementById('payment-form').style.display = 'none';
  document.getElementById('payment-loading').style.display = 'block';
  document.getElementById('payment-loading').innerHTML = `
    <div class="p-4 text-center">
      <img src="https://www.lydia-app.com/assets/img/logo.svg" alt="Lydia" class="h-12 mx-auto mb-4">
      <p class="text-green-600 text-xl font-bold mb-2">Montant: ${totalAmount}€</p>
      <p class="text-gray-600 mb-4">Vous allez être redirigé vers Lydia pour finaliser votre paiement...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
    </div>
  `;
  
  // Vider le panier avant redirection (après un délai pour permettre à l'utilisateur de voir le récapitulatif)
  setTimeout(() => {
    cart = [];
    updateCart();
    
    // Redirection vers Lydia
    window.location.href = finalUrl;
  }, 1500);
}

// Affichage du message de succès (utilisé uniquement si on ne redirige pas)
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

// Ouverture de la modal de paiement
function openPaymentModal() {
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }
  
  document.getElementById('payment-modal').classList.remove('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Afficher les options de paiement
  showPaymentOptions();
  
  // Mettre à jour le total affiché
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('payment-total').textContent = `${total.toFixed(2)}€`;
}

// Fermeture de la modal de paiement
function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = 'auto';
  
  // Réinitialiser la modal
  document.getElementById('payment-form').style.display = 'none';
  document.getElementById('payment-loading').style.display = 'block';
  document.getElementById('payment-success').style.display = 'none';
  document.getElementById('payment-message').classList.add('hidden');
  document.getElementById('payment-submit').disabled = false;
  document.getElementById('payment-submit').textContent = 'Payer maintenant';
}

// Ajout des écouteurs d'événements une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', handlePaymentSubmit);
  }
  
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', closePaymentModal);
  });
});
