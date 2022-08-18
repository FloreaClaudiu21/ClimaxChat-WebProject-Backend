const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const Firestore = initializeApp({
    credential: cert({
        "type": "service_account",
        "project_id": process.env.project_id,
        "private_key_id": process.env.private_key_id,
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDG/Y3fLYiDb+n5\nvtbl0VNq6Qs/iMl+9XMZ3NUUKGs/Z1Vpahe+kQYEzAhwd89uocGj/RTEEBgEqips\nWCm0FypgJu6Gjw3POnwyDeKvAgFz5W31Z71dF46joxIT/CBB88scBENYsO2YlLjW\nuwOY6ebz6JZlIxNd8lZxzO7YhAlrP73Zc6dtdawACc4EhfMV7oSG/HRKtG0ZQLiz\n+CQGoYyB7pyHOnAN8gGVdj/J7U4T+PS9uwa6PhPutz16mNf/SG1UynW/t/WXICTS\nYm/0GX8C1E0QpS8B+t8+kSrGsK9Z10w54oBVQGHk7QQEcg0GWkIevxLsIDLsA4KB\nejU8NczlAgMBAAECggEALT6pI6nZfJM1dsr410vjZO9klpdeQ08BUwvWag0vp3yy\nG7Qa/oJAhVY0BAiF4nCGlCge8N5865CacUSRhOhwgujPOsqrl+cDJqloFaVF2cl8\nmTwzfwd0cAoLuf4NgplxYOcqPfAKsfL83RwsGvhyAhrsGUZiqK2JkLoJQ7Mv5hGz\nH3ZV75PH3eO8n0w/pI9uQUT7xjBEUgNociHltWU0g9f2mQggcULLO6jzkdYY9N6I\noVFtoVelHXfeI/wfH95fUzSDB8MnuujmzsxS+CH7h9SBjbLusV2dIZgBEi6fICls\nBzh6ej4aVwQEy8cPELlXa5fAzh0q7h+57LjiWt0q0QKBgQDv6PXO4z3HO5W3VJ1I\nFVLGtZjPhB5zNRjSCftk6P+FaqSsaGN/ayq2Vn8qPNzicDsa1bh96aFblZMMNXzK\nIe462C+174A0IFexbg7tA7xie3ipZ1cADTLxos2bcoRjFi1xgdDThVIZkNA730FF\nQC6jMINDlKxAL0HAw6pwwbkJUQKBgQDUVgq52qMsc4soE6cK02g6ETDXo0SQu72n\nSYNBA/n2wI6gw05mYjRLnKBHiyMbZdWgxNihK9CZdQDB3+UQa5nRtAQuhydCTFnc\nYNluh7SVbiZ7mVHjNJk5mpfmIozeYcdf4ZjCrIoB0h2Vezma2TPwCZOYkyYWtyC3\nlbVt+V0lVQKBgDXWbosN/cge+/sXNvB9MIU9LVysRnUOHlLMQKkljGnxQ6EZD/MB\nJqWihYkB/YOnMexUt8Ex068MwuIDgsyNjruP1i0a4QdRlrxPeXQA2Z60HKDPevuc\n+qi1IzTWHxVpXatSOX2uNn1cPQ6ijDAxNgYTFfHthDYnJLdQcYg6QP7xAoGAaHjR\nHDKDuFo9LIHG3V+412Ef6+kr0h5dKNLVnoaLVSnWwyh1CZDl9BHjFnBR3KgVHN3d\nTCdXojlcHwe/F34pl3D/4bijy03vpKuOL4Dbi+4/Ru7fyG9XuGzksdlr//qR8w33\ncEkeOdkcrzCK3jJiCIddtGMqCWEe2tTxCGP5vWUCgYEA1TgwLWwYuNof3vxxJeY1\nPOU7RPNjF+xzz2sX0RFKyAjnWPLEJeCal9Fd3LYKd4sGz6WOydQsjcoHsQSVExby\nQOds3YWNKWsw4fAENr8u1hw9Q/MqqEDirfg9JZXLWrC9h5FaaR54S6tF8hdjhYQd\nziHgUycPqv3NZ0wU1dg8LL0=\n-----END PRIVATE KEY-----\n",
        "client_email": process.env.client_email,
        "client_id": process.env.client_id,
        "auth_uri": process.env.auth_uri,
        "token_uri": process.env.token_uri,
        "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.client_x509_cert_url
    })
});

const DB = getFirestore(Firestore)
const UsersDB = DB.collection("users")
const ChatsDB = DB.collection("chats")
const GroupsDB = DB.collection("groups")

module.exports = {Firestore, DB, UsersDB, ChatsDB, GroupsDB}