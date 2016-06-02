import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';

const setNoficiationViewed = {
  type: BooleanType,
  args: {
    id: { type: new NonNull(IntType) }
  },
  async resolve(_, { id }, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return false;
    }

    db.connect(({ query }) => {

      // Notifications will show up as viewed first, and newest first
      query(
        `UPDATE notifications SET viewed = true WHERE id = $1 AND character_id = $2`,
        id, auth.id
      );

    }).catch((err) => {

      console.log(err);
    });

    return true;
  },
};

export default setNoficiationViewed;
