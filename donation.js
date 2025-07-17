// URL directe vers HelloAsso
const HELLOASSO_URL = 'https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16';

// Fonction pour rediriger vers HelloAsso
function redirectToHelloAsso(amount = '') {
    // Si un montant est fourni, l'ajouter à l'URL
    let url = HELLOASSO_URL;
    if (amount && !isNaN(parseFloat(amount))) {
        // HelloAsso attend le montant en centimes
        const amountInCents = Math.round(parseFloat(amount) * 100);
        url += `?amount=${amountInCents}`;
    }
    
    // Rediriger vers HelloAsso
    window.location.href = url;
}

// Initialiser les boutons de don quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter un événement sur tous les boutons de don
    const donationButtons = document.querySelectorAll('.donation-button');
    donationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Récupérer le montant s'il existe
            const amount = this.getAttribute('data-amount') || '';
            redirectToHelloAsso(amount);
        });
    });
    
    // Ajouter un événement sur le formulaire de don personnalisé
    const customDonationForm = document.getElementById('custom-donation-form');
    if (customDonationForm) {
        customDonationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = document.getElementById('custom-donation-amount').value;
            if (amount && !isNaN(parseFloat(amount))) {
                redirectToHelloAsso(amount);
            } else {
                alert('Veuillez entrer un montant valide');
            }
        });
    }
});
