import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id) => {
        return Promise.resolve({
          id,
          email: 'test@mail.com',
          password: 'mypassword',
        } as User);
      },
      find: (email) => {
        return Promise.resolve([
          { id: 1, email, password: 'mypassword' },
        ] as User[]);
      },
      update: (id, attrs) => {
        return Promise.resolve({ id, ...attrs } as User);
      },
      remove: (id) => {
        return Promise.resolve({
          id,
          email: 'user@email.com',
          passowrd: 'mypassword',
        } as any);
      },
    };

    fakeAuthService = {
      signup: (email, password) => {
        return Promise.resolve({ email, password, id: 1 } as User);
      },
      signin: (email, password) => {
        return Promise.resolve({ email, password, id: 1 } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('user@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('user@email.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('findUser throws an error if the user with the given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      {
        email: 'user@mail.com',
        password: 'mypassword',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
