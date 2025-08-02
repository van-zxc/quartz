标签: [[数学]] [[级数]] [[幂级数]] [[Taylor展开]] [[公式]]

# 定义

函数某一点按照[[Taylor展开]]的方式, 构造幂级数, 那么该幂级数就称为Taylor级数. 

显然的, 如果一个函数如果可以被表示为幂级数, 那么该级数若想在该点附近的邻域内成立, 则必然为Taylor级数. 

然而, Taylor级数也并非万能, 因为很可能会出现很多根本无法使用Taylor级数表达, 无法收敛的级数. 

## 严格收敛

什么时候一个Taylor公式才能严格等于该函数呢? 我们有如下定理: 

假设该函数有任意阶导数, 那么Taylor展开和函数本身严格相等的充要条件是
$$
\lim_{ n \to \infty } r_{n}(x) = 0
$$
# 初等函数Taylor展开

1. 
$$
e^{x} = \sum_{n=0}^{\infty} \frac{x^{n}}{n!} = 1 + x + \frac{1}{2}x^{2} + \frac{1}{3!}x^{3} + \dots \quad R \in (-\infty, +\infty)
$$
2. 
$$
\sin x = \sum_{n=0}^{\infty} \frac{(-1)^{n}}{(2n+1)!}x^{2n+1} = x - \frac{x^{3}}{3!} + \frac{x^{5}}{5!} + \dots \quad R \in (-\infty, +\infty) 
$$
3. 
$$
\cos x = \sum_{n=0}^{\infty} \frac{(-1)^{n}}{(2n)!}x^{2n} = 1 - \frac{x^{2}}{2} + \frac{x^{4}}{4!} + \dots  \quad R \in (-\infty, +\infty)
$$
4. 
$$
\arctan x = \sum_{n=0}^{\infty} \frac{(-1)^{n}}{2n+1} x^{2n+1} = x - \frac{x^{3}}{3!} + \frac{x^{5}}{5} + \dots \quad R \in [-1, 1]
$$
5. 
$$
\ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n}x^{n} = x - \frac{x^{2}}{2} + \frac{x^{3}}{3} + \dots \quad R \in (-1, 1]
$$
6. 若使用
$$
\binom{\alpha}{n} = \frac{\alpha(\alpha-1)\dots(\alpha-n+1)}{n!},\ \binom{\alpha}{0} = 1
$$
	来表达广义组合数, 那么
$$
\begin{align}
 & (1+x)^{\alpha} = \sum_{n=0}^{\infty} \binom{\alpha}{n} x^{n} \\
 & \begin{cases}
x \in (-1, 1) \quad \alpha \leq-1 \\
x \in (-1, 1] \quad -1 < \alpha < 0 \\
x \in [-1, 1] \quad \alpha \geq 0
\end{cases}
\end{align}
$$
7. 
$$
\arcsin x = x + \sum_{n=1}^{\infty} \frac{(2n-1)!!}{(2n)!!} \frac{x^{2n+1}}{2n+1} \quad x \in [-1, 1]
$$ 
需要注意的是, 如果在收敛域之外的话, 我们需要通过换元给其换到收敛域之内再操作, 否则收敛不了啊! 