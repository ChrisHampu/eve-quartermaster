import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import db from '../../core/db';
import verifySession from '../../core/verifySession';

const deleteRequest = {
  type: BooleanType,
  args: {
    id: { type: new NonNull(IntType) }
  },
  async resolve(_, { id }, session) {

    const auth = await verifySession(session);

    if (!auth.authenticated) {
      return false;
    }

    return new Promise((resolve) => {

      db.connect(async ({ query }) => {

        await query(
          `DELETE FROM requests CASCADE WHERE id = $1 AND character_id = $2`,
          id, auth.id
        );

        resolve(true);

      }).catch((err) => {

        console.log("Error while deleting request:");
        console.log(err);

        resolve(true);
      });
    });
  },
};

export default deleteRequest;