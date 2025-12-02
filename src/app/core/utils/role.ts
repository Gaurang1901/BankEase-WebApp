import { User } from '../auth/store/auth.state';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

export type Permissions = {
  masterModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  userModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  accountModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  transactionModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  loanModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  cardModule: {
    dataType: any;
    action: 'create' | 'view' | 'edit' | 'delete';
  };
  myAccountModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  myTransactionModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  myLoanModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  myCardModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  mySavingsGoalModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  analyticsModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  budgetModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
  statementModule: {
    dataType: any;
    action: 'view' | 'edit';
  };
};

export type PermissionRequirement = {
  [Resource in keyof Permissions]: {
    resource: Resource;
    action: Permissions[Resource]['action'];
  };
}[keyof Permissions];

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data?: Permissions[Key]['dataType']) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>;
    }>;
  }>;
};

const ROLES = {
  ROLE_ADMIN: {
    masterModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    userModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    accountModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    transactionModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    loanModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    cardModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },

  ROLE_SUPER_ADMIN: {
    masterModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    userModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    accountModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    transactionModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    loanModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
    cardModule: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  ROLE_USER: {
    myAccountModule: {
      view: true,
      edit: true,
    },
    myTransactionModule: {
      view: true,
      edit: true,
    },
    myLoanModule: {
      view: true,
      edit: true,
    },
    myCardModule: {
      view: true,
      edit: true,
    },
    mySavingsGoalModule: {
      view: true,
      edit: true,
    },
    analyticsModule: {
      view: true,
      edit: true,
    },
    budgetModule: {
      view: true,
      edit: true,
    },
    statementModule: {
      view: true,
      edit: true,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
): boolean {
  if (!user?.roles) {
    return false;
  }

  const role = user.roles as Role;

  const permission = (ROLES as any)[role]?.[resource]?.[action];

  if (permission == null) {
    return false;
  }

  if (typeof permission === 'boolean') {
    return permission;
  }

  return permission(user, data);
}
