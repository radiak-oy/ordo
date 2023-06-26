/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/admin/users": {
    get: {
      responses: {
        /** @description Success */
        200: never;
      };
    };
    post: {
      parameters: {
        query?: {
          role?: string;
          username?: string;
          password?: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/admin/users/{userId}": {
    get: {
      parameters: {
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
    delete: {
      parameters: {
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/admin/users/{userId}/password": {
    put: {
      parameters: {
        query?: {
          password?: string;
        };
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/admin/users/{userId}/claims": {
    get: {
      parameters: {
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
    post: {
      parameters: {
        query?: {
          claimType?: string;
          claimValue?: string;
        };
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
    delete: {
      parameters: {
        query?: {
          claimType?: string;
          claimValue?: string;
        };
        path: {
          userId: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/gigs/done": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["DoneGigDto"])[];
            "application/json": (components["schemas"]["DoneGigDto"])[];
            "text/json": (components["schemas"]["DoneGigDto"])[];
          };
        };
      };
    };
  };
  "/gigs/upcoming": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["UpcomingGigDto"])[];
            "application/json": (components["schemas"]["UpcomingGigDto"])[];
            "text/json": (components["schemas"]["UpcomingGigDto"])[];
          };
        };
      };
    };
  };
  "/gigs/{id}/signup": {
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/gigs/{id}/signup-cancel": {
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/gigs": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["GigDto"])[];
            "application/json": (components["schemas"]["GigDto"])[];
            "text/json": (components["schemas"]["GigDto"])[];
          };
        };
      };
    };
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["PostGigDto"];
          "text/json": components["schemas"]["PostGigDto"];
          "application/*+json": components["schemas"]["PostGigDto"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["GigDto"];
            "application/json": components["schemas"]["GigDto"];
            "text/json": components["schemas"]["GigDto"];
          };
        };
      };
    };
  };
  "/gigs/{id}": {
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["GigDto"];
            "application/json": components["schemas"]["GigDto"];
            "text/json": components["schemas"]["GigDto"];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["EditGigDto"];
          "text/json": components["schemas"]["EditGigDto"];
          "application/*+json": components["schemas"]["EditGigDto"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["GigDto"];
            "application/json": components["schemas"]["GigDto"];
            "text/json": components["schemas"]["GigDto"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/login": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["LoginDto"];
          "text/json": components["schemas"]["LoginDto"];
          "application/*+json": components["schemas"]["LoginDto"];
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/login-google": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["LoginGoogleDto"];
          "text/json": components["schemas"]["LoginGoogleDto"];
          "application/*+json": components["schemas"]["LoginGoogleDto"];
        };
      };
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/whoami": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["UserDto"];
            "application/json": components["schemas"]["UserDto"];
            "text/json": components["schemas"]["UserDto"];
          };
        };
      };
    };
  };
  "/logout": {
    post: {
      responses: {
        /** @description Success */
        200: never;
      };
    };
  };
  "/profiles": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["ProfileDto"])[];
            "application/json": (components["schemas"]["ProfileDto"])[];
            "text/json": (components["schemas"]["ProfileDto"])[];
          };
        };
      };
    };
  };
  "/profiles/{workerId}": {
    get: {
      parameters: {
        path: {
          workerId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["ProfileDto"])[];
            "application/json": (components["schemas"]["ProfileDto"])[];
            "text/json": (components["schemas"]["ProfileDto"])[];
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          workerId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": components["schemas"]["EditProfileDto"];
          "text/json": components["schemas"]["EditProfileDto"];
          "application/*+json": components["schemas"]["EditProfileDto"];
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": components["schemas"]["ProfileDto"];
            "application/json": components["schemas"]["ProfileDto"];
            "text/json": components["schemas"]["ProfileDto"];
          };
        };
      };
    };
  };
  "/qualifications": {
    get: {
      responses: {
        /** @description Success */
        200: {
          content: {
            "text/plain": (components["schemas"]["QualificationDto"])[];
            "application/json": (components["schemas"]["QualificationDto"])[];
            "text/json": (components["schemas"]["QualificationDto"])[];
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    DoneGigDto: {
      /** Format: uuid */
      id: string;
      qualification: string;
      /** Format: date-time */
      start: string;
      /** Format: date-time */
      end: string;
      address: string;
    };
    EditGigDto: {
      /** Format: date-time */
      start: string;
      /** Format: date-time */
      end: string;
      address: string;
      /** Format: int32 */
      maxWorkers: number;
      workerIds: (string)[];
    };
    EditProfileDto: {
      name: string;
      qualificationIds: (string)[];
      notes: string;
    };
    GigDto: {
      /** Format: uuid */
      id: string;
      qualification: components["schemas"]["QualificationDto"];
      /** Format: date-time */
      start: string;
      /** Format: date-time */
      end: string;
      address: string;
      /** Format: int32 */
      maxWorkers: number;
      workerIds: (string)[];
    };
    LoginDto: {
      userName: string;
      password: string;
    };
    LoginGoogleDto: {
      code: string;
      scope: string;
      prompt: string;
    };
    PostGigDto: {
      /** Format: uuid */
      qualificationId: string;
      /** Format: date-time */
      start: string;
      /** Format: date-time */
      end: string;
      address: string;
      /** Format: int32 */
      maxWorkers: number;
    };
    ProfileDto: {
      workerId: string;
      name: string;
      qualifications: (components["schemas"]["QualificationDto"])[];
      notes: string;
    };
    QualificationDto: {
      id: string;
      name: string;
    };
    UpcomingGigDto: {
      /** Format: uuid */
      id: string;
      qualification: string;
      /** Format: date-time */
      start: string;
      /** Format: date-time */
      end: string;
      address: string;
      isSignedUp: boolean;
    };
    UserDto: {
      id: string;
      userName?: string | null;
      roles: (string)[];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
