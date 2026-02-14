import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Conference } from '../App';

interface RegistrationViewProps {
  conferences: Conference[];
  onBack: () => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ conferences, onBack }) => {
  // On récupère confId via le hook, mais on utilisera surtout pathname pour Vercel
  const { confId } = useParams(); 
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    institution: '',
    typeParticipation: 'presentiel',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedConf, setSelectedConf] = useState<Conference | null>(null);

  // Fonction utilitaire pour normaliser les chaînes (minuscules, sans accents/espaces)
  const normalizeId = (text: string | undefined) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/\s+/g, '-');
  };

  useEffect(() => {
    // 1. Logique de récupération "Vercel-proof" (via Pathname)
    const path = window.location.pathname;
    const parts = path.split('/');
    const regIndex = parts.indexOf('registration');
    
    let urlId = '';

    // Priorité 1 : Récupérer l'ID depuis l'URL brute (plus fiable sur Vercel après rewrite)
    if (regIndex !== -1 && parts[regIndex + 1]) {
      urlId = decodeURIComponent(parts[regIndex + 1]);
    } 
    // Priorité 2 : Si pathname échoue, on regarde useParams
    else if (confId) {
      urlId = confId;
    }

    // 2. Recherche de la conférence
    if (urlId && conferences.length > 0) {
      const found = conferences.find(c => 
        normalizeId(c.id) === normalizeId(urlId) || 
        normalizeId(c.title) === normalizeId(urlId)
      );
      
      if (found) {
        setSelectedConf(found);
      }
    }
  }, [conferences, location, confId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Données envoyées:', { ...formData, conference: selectedConf?.title });
      
      setStatus('success');
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        institution: '',
        typeParticipation: 'presentiel',
        message: ''
      });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (!selectedConf) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Conférence non trouvée</h2>
        <p className="mb-6">Désolé, nous ne trouvons pas la conférence demandée.</p>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2"
      >
        ← Retour
      </button>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Inscription</h1>
        <h2 className="text-xl text-gray-700">
          Événement : <span className="font-semibold text-blue-600">{selectedConf.title}</span>
        </h2>
        <p className="text-gray-500 mt-2">Date : {selectedConf.date}</p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">Inscription réussie ! ✅</h3>
          <p>Merci {formData.prenom}. Votre demande d'inscription a bien été reçue.</p>
          <p className="mt-4 text-sm">Un email de confirmation vous sera envoyé prochainement.</p>
          <button 
            onClick={onBack}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Retour aux événements
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="prenom"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution / Organisation</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Université, Entreprise, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de participation *</label>
            <select
              name="typeParticipation"
              value={formData.typeParticipation}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="presentiel">En présentiel</option>
              <option value="virtuel">En virtuel (Zoom/Teams)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Besoins spécifiques, questions..."
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-3 rounded text-white font-bold transition ${
                status === 'submitting' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {status === 'submitting' ? 'Envoi en cours...' : 'Confirmer l\'inscription'}
            </button>
            {status === 'error' && (
              <p className="text-red-600 text-center mt-3">Une erreur est survenue. Veuillez réessayer.</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistrationView;