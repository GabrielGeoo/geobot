export default function normalizeString(input: string): string {
  // Remplacement des accents par les lettres sans accent
  const accentsMap: { [key: string]: string } = {
      'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae',
      'ç': 'c',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ð': 'd', 'ñ': 'n',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ý': 'y', 'ÿ': 'y',
      'À': 'a', 'Á': 'a', 'Â': 'a', 'Ã': 'a', 'Ä': 'a', 'Å': 'a', 'Æ': 'ae',
      'Ç': 'c',
      'È': 'e', 'É': 'e', 'Ê': 'e', 'Ë': 'e',
      'Ì': 'i', 'Í': 'i', 'Î': 'i', 'Ï': 'i',
      'Ð': 'd', 'Ñ': 'n',
      'Ò': 'o', 'Ó': 'o', 'Ô': 'o', 'Õ': 'o', 'Ö': 'o', 'Ø': 'o',
      'Ù': 'u', 'Ú': 'u', 'Û': 'u', 'Ü': 'u',
      'Ý': 'y'
  };

  // Fonction pour remplacer les accents
  const replaceAccents = (str: string) => {
      return str.replace(/[À-ÿ]/g, match => accentsMap[match] || match);
  };

  // Conversion de la chaîne
  let normalized = input;
  normalized = replaceAccents(normalized); // Remplacer les accents
  normalized = normalized.toLowerCase();   // Transformer les majuscules en minuscules
  normalized = normalized.replace(/\s+/g, '_'); // Remplacer les espaces par des underscores
  normalized = normalized.replace("'", '_'); // Remplacer les apostrophes par des underscores

  return normalized;
}