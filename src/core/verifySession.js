import jwt from 'jsonwebtoken';
import { fetchCharacter } from '../data/queries/character.js';
import { auth, eve } from '../config';

async function verifySession(session) {

	let user = {};

	try {
		user = jwt.verify(session.jwt, auth.jwt.secret);

		try {

			let res = await fetchCharacter(user.id);

			if(res.alliance !== eve.alliance_id) {
			
				return { authenticated: false };
			}

		} catch(err) {
			return { authenticated: false };
		}	

	} catch (err) {
		return { authenticated: false };
	}

	return { authenticated: true, alliance: user.alliance, corp_id: user.corp_id, corp_name: user.corp_name, id: user.id, name: user.name };
};

export default verifySession;