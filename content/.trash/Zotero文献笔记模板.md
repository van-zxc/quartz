---
citekey:
  "{ citekey }":
title: "{{title}}"
authors: "{{authors}}"
year:
  "{ year }":
journal: "{{publicationTitle}}"
tags:
zotero_link:
  "{ zoteroSelectURI }":
---

> [!Abstract] 摘要
> {{abstractNote}}

---

## 标注与批注 (Annotations)

{% for annotation in annotations %}
> [!quote] (Page: {{annotation.page}})
> {{annotation.comment | default(annotation.text)}} 
> ^{{annotation.id}}
{% endfor %}

---

## 我的思考 (My Notes)

-