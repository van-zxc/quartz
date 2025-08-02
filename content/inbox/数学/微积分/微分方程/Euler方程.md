标签: [[数学]] [[微分方程]] [[公式]]

# 一般形式

我们先介绍二阶的, 再介绍$n$阶的

二阶形式如下
$$
x^{2} \frac{\mathrm{d}^{2}y}{\mathrm{d}x^{2}} + px \frac{\mathrm{d}y}{\mathrm{d}x} + qy = f(x)
$$

对于这种不熟悉的方程, 我们一般直接的想法是把其转化为我们熟悉的方程去做. 通过观察, 发现导数前面的系数都是$kx^{n}$. 形式比较简单, 因此我们会考虑能不能消掉前面的x的多项式, 变为[[常系数线性微分方程]]. 

令$x = e^{t} \implies t = \ln x$. 两侧同时求导$\mathrm{d}t = \frac{1}{x} \mathrm{d}x$(该方法要求$x>0$)

因此
$$
\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}t} \cdot \frac{\mathrm{d}t}{\mathrm{d}x} = \frac{1}{x} \frac{\mathrm{d}y}{\mathrm{d}t}
$$
$$
\frac{\mathrm{d}^{2}y}{\mathrm{d}x^{2}} = \frac{\mathrm{d}}{\mathrm{d}x}\left( \frac{1}{x} \frac{\mathrm{d}y}{\mathrm{d}t} \right) = \frac{\mathrm{d}}{\mathrm{d}t}\left( \frac{1}{x} \frac{\mathrm{d}y}{\mathrm{d}t} \right) \frac{\mathrm{d}t}{\mathrm{d}x} = \frac{1}{x} \cdot \left( \frac{1}{x} \frac{\mathrm{d}^{2}y}{\mathrm{d}t^{2}} - \frac{1}{x} \frac{\mathrm{d}y}{\mathrm{d}t} \right) = \frac{1}{x^{2}} \left( \frac{\mathrm{d}^{2}y}{\mathrm{d}t^{2}} - \frac{\mathrm{d}y}{\mathrm{d}t} \right)
$$
带入原式 化简为
$$
\frac{\mathrm{d}^{2}y}{\mathrm{d}t^{2}} + (p-1) \frac{\mathrm{d}y}{\mathrm{d}t} + qy = f(e^{t})
$$
于是化为[[常系数线性微分方程]]的形式, 按照该种方法求解即可. 最后换回$t$到$x$

当不止二阶的时候形式如下
$$
x^{n} \frac{\mathrm{d}^{n}y}{\mathrm{d}t^{n}} + a_{n-1} x^{n-1} \frac{\mathrm{d}^{n-1}y}{\mathrm{d}x^{n-1}} + \dots + a_{1} x \frac{\mathrm{d}y}{\mathrm{d}x} + a_{0} y  = f(x)
$$
类似的, 令$x = e^{t}$求解即可. 