"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const fs = require("fs");
// Implement the generated interface
class Root {
    person(args) {
        return new Person(args.name, 1981);
    }
}
class Person {
    constructor(name, yearOfBirth) {
        this.name = name;
        this.yearOfBirth = yearOfBirth;
    }
    age(_, context) {
        return context.year - this.yearOfBirth;
    }
    friends() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve([
                new Person(this.name + "'s first friend", this.yearOfBirth - 1),
                new Person(this.name + "'s second friend", this.yearOfBirth - 2)
            ]);
        });
    }
}
// Run a query
graphql_1.graphql(graphql_1.buildSchema(fs.readFileSync('graphql/schema/example.graphqls', { encoding: 'utf-8' })), '{ person(name:"Joye") { name age friends { name age } }}', new Root(), { year: 2017 }).then((result) => console.log(JSON.stringify(result, null, 2)));
//# sourceMappingURL=example-usage.js.map