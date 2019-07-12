/**
 * Ova funkcija dohvaca filmove iz baze podataka.
 * Odlazi na URL: localhost:8080/filmovi/data gdje prima JSON objekt kao odgovor.
 * Polja koja se nalaze unutar odgovora za svaki film su:
 *  categories, hashName, movieName (bas ime file-a kako se zove.mp4), hrvName, engName,
 *  description, trailerLink i imgFile (bas bitovi slike)
 * @param {String} url - Link za rutu do baze da nam da podatke
 */
async function getMovies(url) {
    const requestRes = await fetch(url)
    return await requestRes.json()
}
