# hbelt

Heroku account belt

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/hbelt.svg)](https://npmjs.org/package/hbelt)
[![Downloads/week](https://img.shields.io/npm/dw/hbelt.svg)](https://npmjs.org/package/hbelt)
[![License](https://img.shields.io/npm/l/hbelt.svg)](https://github.com/rqbik/hbelt/blob/master/package.json)

- [Installation](#installation)
- [Commands](#commands)

# Installation

```sh-session
$ heroku plugins:install hbelt
```

# Commands

- [`heroku belt:add`](#heroku-beltadd)
- [`heroku belt:remove`](#heroku-beltremove)
- [`heroku belt:switch`](#heroku-beltswitch)
- [`heroku belt:list`](#heroku-beltlist)

## `heroku belt:add`

add heroku account to your belt

```
USAGE
  $ heroku belt:add

OPTIONS
  -e, --email=email        account email
  -p, --password=password  account password
```

## `heroku belt:remove`

removes heroku account from your belt

```
USAGE
  $ heroku belt:remove

OPTIONS
  -e, --email=email  account email
  -i, --id=id        account id
  -n, --name=name    account name
  -x, --index=index  account idx in list
```

## `heroku belt:switch`

allows you to switch between multiple heroku account in your belt

```
USAGE
  $ heroku belt:switch

OPTIONS
  -e, --email=email  account email
  -i, --id=id        account id
  -n, --name=name    account name
  -x, --index=index  account idx in list
```

## `heroku belt:list`

lists every account in your belt

```
USAGE
  $ heroku belt:list

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```
