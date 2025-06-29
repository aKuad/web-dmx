# CONTRIBUTING

There are development conventions in this repository.

Main purpose is organizing and reminding conventions for me ([aKuad](https://github.com/aKuad)).

## Workflow conventions

1 issue, 1 branch, 1 PR

Follow this workflow:

1. Create an issue (what describe required work)
2. Create a branch and start working on it
3. Sometimes push the working branch
4. Create a pull request for the working branch merge to `main`
5. Confirm the pull request

Prohibited:

- Create branches or PRs without any issues
- Directly commit to `main` branch

## Branch naming, GitHub issue/PR tag and issue template

### Branch name format

`<target>/<action>/<desc>`

For `<desc>`, put words for describe the work. Multiple words join with `-`. (e.g. `feature/add/work-desc-here`)

> [!NOTE]
>
> Branch name format checked by `assets/pre-push` git hook.

### GitHub issue/PR tag

A branch must be linked to an issue and PR. The issue and PR must be have related tags.

Tags conventions also indicate below.

### Target word and issue template

> [!NOTE]
>
> Issue template selection and edit target is related.

| Target word   | GitHub tag       | Issue template    | Description                           |
| ------------- | ---------------- | ----------------- | ------------------------------------- |
| `feature-dev` | `tg/feature-dev` | Feature - Device  | Code editing of device firmware       |
| `feature-web` | `tg/feature-web` | Feature - Web App | Code editing                          |
| `doc`         | `tg/doc`         | Documentation     | Document editing                      |
| `infra`       | `tg/infra`       | Infrastructure    | Repository infrastructure maintaining |
| `misc`        | `tg/misc`        | Miscellaneous     | Other of them                         |

### Action word

| Action word | GitHub tag | Action       |
| ----------- | ---------- | ------------ |
| `add`       | `act/add`  | Addition     |
| `mod`       | `act/mod`  | Modification |
| `fix`       | `act/fix`  | Fix          |
| `del`       | `act/del`  | Deletion     |

## Coding conventions

> [!IMPORTANT]
>
> For test code, there are some different conventions. See: [src_web/tests/README.md](src_web/tests/README.md)

### Source files location

| Location                 | Items                                      |
| ------------------------ | ------------------------------------------ |
| `src_device/cube-mx`     | Firmware project of Cube MX                |
| `src_device/platform-io` | Firmware project of platform.io            |
| `src_web/modules`        | TS modules for server side                 |
| `src_web/pages`          | HTML pages of client UI                    |
| `src_web/static`         | JS modules for client & server side        |
| `src_web/tests`          | Test code of modules in `modules`/`static` |

### Files naming

> [!NOTE]
>
> Not applied to firmware code in `src_device`.

| Item                        | Convention (also `.ts` is) |
| --------------------------- | -------------------------- |
| Class definition module     | `UpperCamelCase.js`        |
| Functions definition module | `snake_case.js`            |

### Functions and variables (etc.) naming

> [!NOTE]
>
> Not applied to firmware code in `src_device`.

Follow [RFC 430](https://github.com/rust-lang/rfcs/blob/master/text/0430-finalizing-naming-conventions.md).

But in JavaScript, constant variables can be written in lower_snake_case. Because there are many constant variables in JavaScript (const object members won't be protected from writing), then many UPPER CHARACTERS in the code is bad looks.

## Messages syntax conventions

### Commit message

| Syntax       | Description                   |
| ------------ | ----------------------------- |
| `Add: <mes>` | Made something new            |
| `Mod: <mes>` | Something needed modification |
| `Fix: <mes>` | Something was wrong           |
| `Del: <mes>` | Something been unnecessary    |

Put a short description and reasons of commit into `<mes>`. Reasons are better.

> [!NOTE]
>
> Message format will be checked by `assets/commit-msg` git hook.

### Commit sign-off

Put sign-off into each commit message.

e.g.

```txt
commit message here

Signed-off-by: aKuad <53811809+aKuad@users.noreply.github.com>
```

On git CLI, you can put sign-off easily with `-s` option.

```sh
git commit -s -m "commit message here"
```

> [!NOTE]
>
> Commit signoff will be checked by `assets/commit-msg` git hook.

### Pull request title

To create a pull request, 1 related issue requires. (1 issue, 1 branch, 1 PR)

```txt
related issue title (#issue_id)
```

e.g.

```txt
Module creation for core feature (#1)
```

### Merge commit message

```txt
related issue title (Issue #issue_id, PR #pr_id)
```

e.g.

```txt
Module creation for core feature (Issue #1, PR #2)
```
