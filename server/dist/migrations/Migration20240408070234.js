"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240408070234 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240408070234 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" text not null);');
    }
    async down() {
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20240408070234 = Migration20240408070234;
//# sourceMappingURL=Migration20240408070234.js.map