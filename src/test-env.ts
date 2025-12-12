/**
 * Test simple pour vérifier que les variables d'environnement sont chargées
 * Ce script peut être exécuté avec: npm run build:dev
 * puis vérifier manuellement dans dist/assets/*.js que les variables ne sont pas "undefined"
 */

console.log('='.repeat(60));
console.log('Test des Variables d\'Environnement Vite');
console.log('='.repeat(60));

// Dans un environnement Vite, on utilise import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('\n📋 Variables détectées:');
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Défini' : '❌ Non défini'}`);
console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Défini' : '❌ Non défini'}`);

if (supabaseUrl) {
  console.log(`\n🔗 URL: ${supabaseUrl}`);
  console.log(`   Format: ${supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co') ? '✅' : '❌'}`);
}

if (supabaseKey) {
  console.log(`\n🔑 Clé Anon: ${supabaseKey.substring(0, 20)}...`);
  console.log(`   Format JWT: ${supabaseKey.startsWith('eyJ') ? '✅' : '❌'}`);
}

console.log('\n' + '='.repeat(60));
if (supabaseUrl && supabaseKey) {
  console.log('✅ Toutes les variables sont définies!');
} else {
  console.log('❌ Certaines variables manquent!');
}
console.log('='.repeat(60));

export { supabaseUrl, supabaseKey };
