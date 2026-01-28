---
status: todo
weight: 1
field: 
date: {{date | format("YYYY-MM")}}
DOI: {{DOI}}
citekey: {{citekey}}
aliases: ["@{{citekey}}"]
authors: "{{allAuthors}}"
tags: "文献笔记, {{allTags}}"
journal: {{publicationTitle | default(journalAbbreviation) | default(university)}}
language: {{language}}
itemType: {{itemType}}
thesisType: {{thesisType}}
---

# 论文信息
**title:** {{title}}
**DOI:** {{DOI}}
**tags:** {{allTags}}
**level:** {% if archive %}{{archive}}{% endif %} {% if archiveLocation%}{{archiveLocation}}{% endif %}
**IF:** {% if callNumber %}{{callNumber}}{% endif %}
**期刊:** {{publicationTitle | default(university)}}
**类别:** {{itemType}} {{thesisType}}

### 引用信息 (IEEE)
> {{bibliography}}

---

## abstract: 
{{abstractNote | nl2br}}

---

## Files and Links
- **Zotero Entry**: [Open in Zotero]({{zoteroSelectURI}})
- **Local PDF**: [Open PDF]({{localPDF path="true"}})
- **Online URL**: [Open online]({{url}})

---

# 概要

# 研究对象

# 背景

# 方法

# 结论

---

# 标注
{% persist "annotations" %}

## 黄色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#ffd400' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论:
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 红色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#ff6666' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 绿色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#5fb236' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 蓝色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#2ea8e5' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 紫色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#a28ae5' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 洋红色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#e56eee' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 橘色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#f19837' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

## 灰色
{% set i=1%}{% for annotation in annotations %}{% if annotation.color == '#aaaaaa' %}
### 第{{i}}个注释{% set i=i+1 %}
#### 文本:
{{annotation.annotatedText}}
#### 评论: 
{{annotation.comment | default("N/A") | nl2br}}{% if annotation.imageBaseName %}
![[{{annotation.imageBaseName}}]]{% endif %}
#### zotero位置:
[Page {{annotation.page}}]({{annotation.zoteroLink}})
{% endif %}{% endfor %}

---

# 导入记录
{% set newAnnotations = annotations | filterby("date", "dateafter", lastImportDate) %}
{% if newAnnotations.length > 0 %}

## Imported: {{importDate | format("YYYY-MM-DD h:mm a")}}

{% for a in newAnnotations %}
> {{a.annotatedText | truncate(75)}} ([Page {{a.page}}]({{a.zoteroLink}}))
{% endfor %}

{% endif %}
{% endpersist %}