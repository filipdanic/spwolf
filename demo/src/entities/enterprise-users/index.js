import accessControl from './access-control';
import common from './common';
import userGroups from './user-groups';

export default {
  sections: [{
    elements: common,
    meta: { title: 'User Identity' }
  }, {
    elements: userGroups,
    meta: { title: 'User Groups and Access' }
  }, {
    elements: accessControl,
    meta: { title: 'Cards' }
  }],
  conditionalFields: [{
    name: 'isAppUser',
    fn: (state) => state.role > 0,
    dependsOn: ['role'],
  }, {
    name: 'isAdmin',
    fn: (state) => state.role === 2,
    dependsOn: ['role'],
  }, {
    name: 'parityMaskNotSet',
    fn: (state) => !state.parityMaskLength,
    dependsOn: ['parityMaskLength'],
  }]
};
