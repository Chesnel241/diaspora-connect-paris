import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InscriptionSection from '../InscriptionSection';
import { LanguageContext } from '@/contexts/LanguageContext';

describe('InscriptionSection', () => {
  function renderWithLang(lang: 'fr' | 'en' = 'fr') {
    return render(
      <LanguageContext.Provider value={{ language: lang, t: (k: string) => k }}>
        <InscriptionSection />
      </LanguageContext.Provider>
    );
  }

  it('affiche tous les champs du formulaire', () => {
    renderWithLang('fr');
    expect(screen.getByLabelText(/Nom Complet|Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone|Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pays|Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville|City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Langue parlée|Spoken language/i)).toBeInTheDocument();
  });

  it('valide la soumission vide', async () => {
    renderWithLang('fr');
    fireEvent.click(screen.getByRole('button', { name: /Confirmer mon Inscription|Confirm Registration/i }));
    expect(await screen.findAllByText(/Required|Requis|Erreur/i)).not.toHaveLength(0);
  });

  it('accepte une langue parlée', () => {
    renderWithLang('fr');
    const input = screen.getByPlaceholderText(/Langue parlée|Spoken language/i);
    fireEvent.change(input, { target: { value: 'Français' } });
    expect(input).toHaveValue('Français');
  });
});
