标签：[[物理]] [[电磁感应]] [[分析]] [[电感]] [[电容]] [[电磁学]]

分析： 从电荷出发：
$$
-L\frac{\mathrm{d}i}{\mathrm{d}t} - \frac{q}{C} = 0
$$
因为
$$
i = \frac{\mathrm{d}q}{\mathrm{d}t} \to \frac{\mathrm{d}i}{\mathrm{d}t} = \frac{\mathrm{d}^2 q}{\mathrm{d}t^2}
$$
所以：
$$
\frac{\mathrm{d}^2 q}{\mathrm{d}t^2} + \frac{1}{LC} = 0
$$
可以类比[[振动#表达振动的数学方式]]的方程。故可以得出：
$$
q = Q\cos(\omega t + \phi), \, \omega = \sqrt{ \frac{1}{LC} }
$$

可以类比振动表达式得到：

|      | 弹簧                                   | L-C振荡电路                               |     |
| ---- | ------------------------------------ | ------------------------------------- | --- |
| 动能   | $\frac{1}{2} mv^2$                   | $\frac{1}{2}Li^2$                     |     |
| 势能   | $\frac{1}{2}kx^2$                    | $\frac{1}{2} \frac{1}{C} q^2$         |     |
| 速度   | $\pm \sqrt{ k/m }\sqrt{ A^2 - x^2 }$ | $\pm \sqrt{ 1/LC }\sqrt{ Q^2 - q^2 }$ |     |
| 质量   | $m$                                  | $L$                                   |     |
| 弹性系数 | $k$                                  | $\frac{1}{C}$                         |     |
| 周期   | $\sqrt{ \frac{k}{m}}$                | $\sqrt{ \frac{1}{LC} }$               |     |
| 表达式  | $x = A\cos(\omega t + \phi)$         | $q = Q\cos(\omega t+\phi)$            |     |
|      |                                      |                                       |     |
